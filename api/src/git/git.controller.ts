import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { GitService, GitCommandResult } from './git.service';

interface CreateBranchDto {
  branchName: string;
  baseBranch?: string;
}

@Controller('git')
export class GitController {
  constructor(private readonly gitService: GitService) {}

  @Post('branch')
  async createBranch(@Body() createBranchDto: CreateBranchDto): Promise<{
    success: boolean;
    message: string;
    result: GitCommandResult;
  }> {
    try {
      const { branchName, baseBranch = 'main' } = createBranchDto;
      
      if (!branchName) {
        throw new HttpException('Branch name is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.gitService.createBranch(branchName, baseBranch);
      return {
        success: true,
        message: `Branch '${branchName}' created successfully from '${baseBranch}'`,
        result
      };
    } catch (error) {
      throw new HttpException(
        `Failed to create branch: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('branch/checkout')
  async checkoutBranch(@Body() checkoutDto: { branchName: string }): Promise<{
    success: boolean;
    message: string;
    result: GitCommandResult;
  }> {
    try {
      const { branchName } = checkoutDto;
      
      if (!branchName) {
        throw new HttpException('Branch name is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.gitService.checkoutBranch(branchName);
      return {
        success: true,
        message: `Switched to branch '${branchName}'`,
        result
      };
    } catch (error) {
      throw new HttpException(
        `Failed to checkout branch: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('branch/list')
  async listBranches() {
    try {
      const branches = await this.gitService.listBranches();
      return {
        success: true,
        branches
      };
    } catch (error) {
      throw new HttpException(
        `Failed to list branches: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}