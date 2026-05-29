const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src');

const controllers = {
  // ADMIN ONLY (Class Level)
  batches: { type: 'admin_only' },
  majors: { type: 'admin_only' },
  students: { type: 'admin_only' },
  
  // MIXED: GET public, others ADMIN
  categories: { type: 'mixed_get_public_admin_write' },
  tags: { type: 'mixed_get_public_admin_write' },

  // MIXED: POST public, others ADMIN
  contacts: { type: 'mixed_post_public_admin_readwrite' },

  // MIXED: GET User/Admin, others ADMIN
  'bank-accounts': { type: 'mixed_get_auth_admin_write' },

  // MIXED: User (Create/Read Own), Admin (Read All, Update, Delete)
  orders: { type: 'orders' },
  
  // MIXED: AuthGuard on all, Admin can delete? User can do their own
  ratings: { type: 'ratings' },
  wishlists: { type: 'wishlists' }
};

const imports = `import { UseGuards } from '@nestjs/common';\nimport { AuthGuard } from '../auth/auth.guard';\nimport { RolesGuard, Role } from '../helper/roles-guard';\n`;

for (const [name, config] of Object.entries(controllers)) {
  const filePath = path.join(basePath, name, `${name}.controller.ts`);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix imports if not present
  if (!content.includes('AuthGuard')) {
      content = content.replace(/import \{ Controller.*\} from '@nestjs\/common';/, (match) => {
          if (!match.includes('UseGuards')) match = match.replace('Controller', 'Controller, UseGuards');
          return match;
      });
      content = content.replace(/(import .* from '@nestjs\/common';)/, `$1\nimport { AuthGuard } from '../auth/auth.guard';\nimport { RolesGuard, Role } from '../helper/roles-guard';`);
  }

  if (config.type === 'admin_only') {
    if (!content.includes('@UseGuards(AuthGuard, RolesGuard)')) {
        content = content.replace(/@Controller\('.*'\)/, `@UseGuards(AuthGuard, RolesGuard)\n@Role('ADMIN')\n$&`);
    }
  } else if (config.type === 'mixed_get_public_admin_write') {
    // Add Admin guard to Post, Patch, Delete
    content = content.replace(/(@(Post|Patch|Delete)\([^\)]*\)[\s\S]*?(?=create|update|remove))/g, `@UseGuards(AuthGuard, RolesGuard)\n  @Role('ADMIN')\n  $1`);
  } else if (config.type === 'mixed_post_public_admin_readwrite') {
    // Add Admin guard to Get, Patch, Delete
    content = content.replace(/(@(Get|Patch|Delete)\([^\)]*\)[\s\S]*?(?=findAll|findOne|update|remove))/g, `@UseGuards(AuthGuard, RolesGuard)\n  @Role('ADMIN')\n  $1`);
  } else if (config.type === 'mixed_get_auth_admin_write') {
    // Add AuthGuard to Get
    content = content.replace(/(@Get\([^\)]*\)[\s\S]*?(?=findAll|findOne))/g, `@UseGuards(AuthGuard)\n  $1`);
    // Add Admin guard to Post, Patch, Delete
    content = content.replace(/(@(Post|Patch|Delete)\([^\)]*\)[\s\S]*?(?=create|update|remove))/g, `@UseGuards(AuthGuard, RolesGuard)\n  @Role('ADMIN')\n  $1`);
  } else if (config.type === 'orders') {
    // Add AuthGuard to Post
    content = content.replace(/(@Post\([^\)]*\)[\s\S]*?(?=create))/g, `@UseGuards(AuthGuard)\n  $1`);
    // Add Admin to Get, Patch, Delete
    content = content.replace(/(@(Get|Patch|Delete)\([^\)]*\)[\s\S]*?(?=findAll|findOne|update|remove))/g, `@UseGuards(AuthGuard, RolesGuard)\n  @Role('ADMIN')\n  $1`);
  } else if (config.type === 'wishlists' || config.type === 'ratings') {
    if (!content.includes('@UseGuards(AuthGuard)')) {
        content = content.replace(/@Controller\('.*'\)/, `@UseGuards(AuthGuard)\n$&`);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Controllers updated.');
