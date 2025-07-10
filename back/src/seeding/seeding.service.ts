import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ProductoSeeding } from './seeders/product.seed';

@Injectable()
export class SeedingService implements OnModuleInit {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly productSeeding: ProductoSeeding,

) {}

  async onModuleInit() {
    this.logger.log('Iniciando seeding...');
    await this.productSeeding.run();
    this.logger.log('Seeding completado');
  }
}