import { Test, TestingModule } from \'@nestjs/testing\';
import { MajorsService } from \'./majors.service\';

describe(\'MajorsService\', () => {
  let service: MajorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MajorsService, { provide: \'PrismaService\', useValue: {} }],
    }).compile();

    service = module.get<MajorsService>(MajorsService);
  });

  it(\'should be defined\', () => {
    expect(service).toBeDefined();
  });
});
