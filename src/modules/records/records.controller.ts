import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RecordsService } from './records.service';
import {
  CreateRecordDto,
  UpdateRecordDto,
  FilterRecordDto,
} from './dto/record.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import type { AuthenticatedRequest } from '../../common/interfaces/request.interface';

@ApiTags('Financial Records')
@ApiBearerAuth()
@Controller('api/v1/records')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @Permissions('record:create')
  @ApiOperation({ summary: 'Create a financial record' })
  @ApiResponse({ status: 201, description: 'Record created' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createRecordDto: CreateRecordDto,
  ) {
    return this.recordsService.create(req.user.id, createRecordDto);
  }

  @Get()
  @Permissions('record:read')
  @ApiOperation({ summary: 'List records with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of records' })
  async findAll(
    @Request() req: AuthenticatedRequest,
    @Query() filterDto: FilterRecordDto,
  ) {
    return this.recordsService.findAll(filterDto, req.user.id, req.user.role);
  }

  @Get(':id')
  @Permissions('record:read')
  @ApiOperation({ summary: 'Get a single record by ID' })
  @ApiResponse({ status: 200, description: 'Record found' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseUUIDPipe) id: string) {
    return this.recordsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Permissions('record:update')
  @ApiOperation({ summary: 'Update a financial record' })
  @ApiResponse({ status: 200, description: 'Record updated' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.recordsService.update(
      id,
      updateRecordDto,
      req.user.id,
      req.user.role,
    );
  }

  @Delete(':id')
  @Permissions('record:delete')
  @ApiOperation({ summary: 'Delete a financial record' })
  @ApiResponse({ status: 200, description: 'Record deleted' })
  @ApiResponse({ status: 404, description: 'Record not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: AuthenticatedRequest) {
    return this.recordsService.remove(id, req.user.id, req.user.role);
  }
}
