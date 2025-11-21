import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface GitCommandResult {
  stdout: string;
  stderr: string;
}

@Injectable()
export class GitService {
  private readonly logger = new Logger(GitService.name);

  async createBranch(branchName: string, baseBranch: string = 'main'): Promise<GitCommandResult> {
    try {
      // First, fetch latest changes
      await this.executeGitCommand('fetch --all');
      
      // Check if base branch exists
      await this.executeGitCommand(`show-ref --verify --quiet refs/heads/${baseBranch}`);
      
      // Create new branch from base branch
      const result = await this.executeGitCommand(`checkout -b ${branchName} ${baseBranch}`);
      
      this.logger.log(`Branch '${branchName}' created successfully from '${baseBranch}'`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create branch '${branchName}' from '${baseBranch}': ${error.message}`);
      throw error;
    }
  }

  async checkoutBranch(branchName: string): Promise<GitCommandResult> {
    try {
      // Fetch latest changes first
      await this.executeGitCommand('fetch --all');
      
      // Check if branch exists
      await this.executeGitCommand(`show-ref --verify --quiet refs/heads/${branchName}`);
      
      // Checkout the branch
      const result = await this.executeGitCommand(`checkout ${branchName}`);
      
      this.logger.log(`Switched to branch '${branchName}'`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to checkout branch '${branchName}': ${error.message}`);
      throw error;
    }
  }

  async listBranches(): Promise<string[]> {
    try {
      const result = await this.executeGitCommand('branch -a');
      const branches = result.stdout
        .split('\n')
        .map(branch => branch.trim())
        .filter(branch => branch.length > 0)
        .map(branch => branch.replace('* ', '').trim());
      
      this.logger.log(`Found ${branches.length} branches`);
      return branches;
    } catch (error) {
      this.logger.error(`Failed to list branches: ${error.message}`);
      throw error;
    }
  }

  async getCurrentBranch(): Promise<string> {
    try {
      const result = await this.executeGitCommand('branch --show-current');
      const currentBranch = result.stdout.trim();
      this.logger.log(`Current branch: ${currentBranch}`);
      return currentBranch;
    } catch (error) {
      this.logger.error(`Failed to get current branch: ${error.message}`);
      throw error;
    }
  }

  private async executeGitCommand(command: string): Promise<GitCommandResult> {
    try {
      const fullCommand = `git ${command}`;
      this.logger.debug(`Executing: ${fullCommand}`);
      
      const result = await execAsync(fullCommand, {
        cwd: process.cwd(),
        encoding: 'utf8'
      });
      
      return result;
    } catch (error) {
      this.logger.error(`Git command failed: ${error.message}`);
      throw error;
    }
  }
}