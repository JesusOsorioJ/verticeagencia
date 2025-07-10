import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Filestorage } from 'src/modules/file-storage/entities/filestorage.entity';
import { Productos } from 'src/modules/productos/entities/productos.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductoSeeding {
  private readonly logger = new Logger(ProductoSeeding.name);

  constructor(
    @InjectRepository(Productos)
    private readonly productoRepo: Repository<Productos>,
    @InjectRepository(Filestorage)
    private readonly fileRepo: Repository<Filestorage>,
  ) { }

  async run(): Promise<void> {
    const count = await this.productoRepo.count();
    if (count === 0) {
      this.logger.log('No hay productos en la base de datos, creando productos de ejemplo…');

      const imagesMeta = [
        {
          "clavePrincipal": "002cfb49-e491-417d-9710-c4ba0a1dd3e2",
          "originalname": "41UbG45DoTL._SS47_.jpg",
          "encoding": "7bit",
          "mimetype": "jpg",
          "size": 854
        },
        {
          "clavePrincipal": "32f21485-afd8-48f0-9af4-dc9d4196a9a6",
          "originalname": "61Qi1yvF01L._AC_SY695_.jpg",
          "encoding": "7bit",
          "mimetype": "jpg",
          "size": 78873
        },
        {
          "clavePrincipal": "97f25403-5039-415a-860e-064727c9872b",
          "originalname": "81UONjUEIhL._AC_SX695_.jpg",
          "encoding": "7bit",
          "mimetype": "jpg",
          "size": 64167
        },
        {
          "clavePrincipal": "773a809b-e86f-412a-b3f6-ff82fa8c8175",
          "originalname": "71NmUk+72TL._AC_SX695_.jpg",
          "encoding": "7bit",
          "mimetype": "jpg",
          "size": 33155
        },
         {
          "clavePrincipal": "c2737fa4-53f5-4307-b576-1f0765d4bdb8",
          "originalname": "81GRVaYRXAL._AC_SX695_.jpg",
          "encoding": "7bit",
          "mimetype": "jpg",
          "size": 64404
        },
        {
          "clavePrincipal": "f403dcbc-7aa3-4ab2-b983-17a6b6305b90",
          "originalname": "71SqniVDynL._AC_SY695_.jpg",
          "encoding": "7bit",
          "mimetype": "jpg",
          "size": 86125
        },
      ].map(img => ({
      ...img,
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: 'local' as const,
    }));

        const savedFiles = await this.fileRepo.save(this.fileRepo.create(imagesMeta));

       const productsData: Partial<Productos>[] = [
      {
        title: 'Zapatos',
        marca: 'Velez',
        description:
          'Zapatos aerodinámicos de gran calidad, con plantilla acolchada y suela antideslizante. Resistente al agua y perfectos para largas caminatas urbanas o paseos de fin de semana.',
        price: 20,
        // Asignamos la relación y la FK en columna
        image_1: savedFiles[0],
        image1: savedFiles[0].clavePrincipal,
        image_2: savedFiles[1],
        image2: savedFiles[1].clavePrincipal,
        image_3: savedFiles[2],
        image3: savedFiles[2].clavePrincipal,
      },
      {
        title: 'Zapatillas Deportivas',
        marca: 'Velez',
        description:
          'Zapatillas ligeras diseñadas para running y entrenamiento. Con amortiguación reforzada y malla transpirable que mantiene el pie fresco durante el ejercicio intenso.',
        price: 35,
        image_1: savedFiles[4],
        image1: savedFiles[4].clavePrincipal,
        image_2: savedFiles[3],
        image2: savedFiles[3].clavePrincipal,
        image_3: savedFiles[5],
        image3: savedFiles[5].clavePrincipal,
      },
      {
        title: 'Botas Casual',
        marca: 'Velez',
        description:
          'Botas de estilo urbano, elaboradas en cuero genuino. Forro interior de felpa para mayor confort y suela resistente que absorbe impactos, ideales para clima frío.',
        price: 45,
        image_1: savedFiles[1],
        image1: savedFiles[1].clavePrincipal,
        image_2: savedFiles[0],
        image2: savedFiles[0].clavePrincipal,
        image_3: savedFiles[5],
        image3: savedFiles[5].clavePrincipal,
      },
      {
        title: 'Sandalias Veraniegas',
        marca: 'Velez',
        description:
          'Sandalias con tiras ajustables y plantilla ergonómica. Materiales resistentes al agua de mar y al sudor, perfectas para la playa o la piscina.',
        price: 15,
        image_1: savedFiles[4],
        image1: savedFiles[4].clavePrincipal,
        image_2: savedFiles[2],
        image2: savedFiles[2].clavePrincipal,
        image_3: savedFiles[1],
        image3: savedFiles[1].clavePrincipal,
      },
      {
        title: 'Mocasines Elegantes',
        marca: 'Velez',
        description:
          'Mocasines de diseño clásico con acabado en piel suave. Suela fina que aporta elegancia y ajuste adaptable al pie para máximo confort en eventos formales.',
        price: 50,
        image_1: savedFiles[5],
        image1: savedFiles[5].clavePrincipal,
        image_2: savedFiles[1],
        image2: savedFiles[1].clavePrincipal,
        image_3: savedFiles[3],
        image3: savedFiles[3].clavePrincipal,
      },
    ];

    const productEntities = this.productoRepo.create(productsData);
    await this.productoRepo.save(productEntities);

    this.logger.log('Se han creado los productos de ejemplo con sus imágenes.');

      this.logger.log('Productos de ejemplo creados con éxito');
    } else {
      this.logger.log(`Ya existen ${count} productos, no se realizará seed.`);
    }
  }
}
