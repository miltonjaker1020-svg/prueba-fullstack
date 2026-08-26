"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = Auth;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
function Auth(...roles) {
    const guards = roles.length > 0 ? [jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard] : [jwt_auth_guard_1.JwtAuthGuard];
    return (0, common_1.applyDecorators)((0, common_1.UseGuards)(...guards), (0, swagger_1.ApiBearerAuth)('access-token'), (0, roles_decorator_1.Roles)(...roles));
}
//# sourceMappingURL=auth.decorator.js.map