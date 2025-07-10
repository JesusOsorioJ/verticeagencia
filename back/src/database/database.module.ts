import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: 'default',
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('config.database.DB_HOST'),
                port: configService.get<number>('config.database.DB_PORT'),
                username: configService.get<string>('config.database.DB_USERNAME'),
                password: configService.get<string>('config.database.DB_PASSWORD'),
                database: configService.get<string>('config.database.DB_NAME'),
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
            })
        }),
    ]
})
export class DatabaseModule implements OnModuleInit {

    private readonly logger = new Logger(DatabaseModule.name);

    constructor(
        @InjectDataSource('default') private readonly defaultDataSource: DataSource,
    ){}

    async onModuleInit() {
        // Validar conexión 'default'
        if (this.defaultDataSource.isInitialized) {
            this.logger.log('Default database connection established');
            const [result] = await this.defaultDataSource.query('SELECT NOW()');
            this.logger.log(`Default database time: ${result.now}`);
        } else {
            this.logger.error('Failed to connect to default database');
        }
    }

}
