import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ToggleActiveDto } from './dto/toggle-active.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import type { AuthenticatedRequest } from '../../common/interfaces/request.interface';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('api/v1/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Permissions('user:manage')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  async getAllUsers(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query.page ?? 1, query.limit ?? 10);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: "Update a user's role" })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usersService.updateRole(id, updateRoleDto.role, req.user.id);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'Activate or deactivate a user' })
  @ApiResponse({ status: 200, description: 'Active status updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async toggleActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() toggleActiveDto: ToggleActiveDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.usersService.toggleActive(
      id,
      toggleActiveDto.isActive,
      req.user.id,
    );
  }
}
