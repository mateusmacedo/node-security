import { appConfig, loggerConfig, throttleConfig } from '@app/common/configs'
import { HealthController } from '@app/common/controllers'
import { loggerFactory } from '@app/common/factories/logger.factory'
import { CommonModuleOptions } from '@app/common/interfaces'
import { CorrelationIdMiddleware } from '@app/common/middlewares'
import { AppConfigService, HealthService, StrategyExplorerService } from '@app/common/services'
import {
  ActiveHandlesMetric,
  ActiveHandlesTotalMetric,
  ControllerInjector,
  EventEmitterInjector,
  GuardInjector,
  HttpRequestDurationSeconds,
  LoggerInjector,
  OpenTelemetryModule,
  PipeInjector,
  ProcessStartTimeMetric,
  ResourceMetric,
  ScheduleInjector
} from '@metinseylan/nestjs-opentelemetry'
import { HttpModule } from '@nestjs/axios'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TerminusModule } from '@nestjs/terminus'
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3'
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import { LoggerModule } from 'nestjs-pino'
import * as path from 'path'

@Module({})
export class CommonModule {
  static register(options: CommonModuleOptions): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        ConfigModule.forRoot({ ...options.configModule }),
        ConfigModule.forFeature(appConfig()),
        ConfigModule.forFeature(throttleConfig()),
        ConfigModule.forFeature(loggerConfig()),
        HttpModule,
        TerminusModule,
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: path.join(__dirname, '/../i18n/lang'),
            watch: true
          },
          resolvers: [{ use: QueryResolver, options: ['lang', 'locale'] }, AcceptLanguageResolver]
        }),
        ThrottlerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService): Promise<ThrottlerModuleOptions> => {
            return {
              ttl: configService.get<number>('throttle.ttl'),
              limit: configService.get<number>('throttle.limit')
            }
          }
        }),
        LoggerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: loggerFactory
        }),
        OpenTelemetryModule.forRoot({
          applicationName: 'nestjs-startkit',
          traceAutoInjectors: [
            ControllerInjector,
            GuardInjector,
            EventEmitterInjector,
            ScheduleInjector,
            PipeInjector,
            LoggerInjector
          ],
          metricAutoObservers: [
            ResourceMetric,
            ProcessStartTimeMetric,
            ActiveHandlesMetric,
            ActiveHandlesTotalMetric,
            HttpRequestDurationSeconds
          ],
          spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
          metricExporter: new PrometheusExporter({
            endpoint: 'metrics',
            port: 8081
          }),
          metricInterval: 1000,
          contextManager: new AsyncLocalStorageContextManager(),
          textMapPropagator: new CompositePropagator({
            propagators: [
              new JaegerPropagator(),
              new W3CTraceContextPropagator(),
              new W3CBaggagePropagator(),
              new B3Propagator(),
              new B3Propagator({
                injectEncoding: B3InjectEncoding.MULTI_HEADER
              })
            ]
          }),
          instrumentations: [getNodeAutoInstrumentations()]
        })
      ],
      providers: [StrategyExplorerService, CorrelationIdMiddleware, HealthService, AppConfigService],
      controllers: [HealthController],
      exports: [StrategyExplorerService, AppConfigService]
    }
  }
}
