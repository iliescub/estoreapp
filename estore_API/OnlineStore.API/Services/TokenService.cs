 using System.IdentityModel.Tokens.Jwt;
     using System.Security.Claims;
     using System.Text;
     using Microsoft.Extensions.Configuration;
     using Microsoft.IdentityModel.Tokens;
     using OnlineStore.Core.Entities;

     namespace OnlineStore.API.Services;

     public sealed class TokenService : ITokenService
     {
         private readonly IConfiguration _config;
         private readonly SymmetricSecurityKey _signingKey;
         private readonly string _issuer;
         private readonly string _audience;
         private readonly double _expiryMinutes;

         public TokenService(IConfiguration config)
         {
             _config = config;
             _issuer = _config["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer missing");
             _audience = _config["Jwt:Audience"] ?? _issuer;
             var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key missing");
             _signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
             _expiryMinutes = double.TryParse(_config["Jwt:ExpiryMinutes"], out var minutes) ? minutes : 60;
         }

         public (string Token, DateTime ExpiresAt) CreateToken(User user)
         {
             var expires = DateTime.UtcNow.AddMinutes(_expiryMinutes);

             var claims = new[]
             {
                 new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                 new Claim(JwtRegisteredClaimNames.Email, user.CustomerEmail),
                 new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}".Trim()),
                 new Claim(ClaimTypes.Role, user.Role),
                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
             };

             var creds = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);

             var token = new JwtSecurityToken(
                 issuer: _issuer,
                 audience: _audience,
                 claims: claims,
                 notBefore: DateTime.UtcNow,
                 expires: expires,
                 signingCredentials: creds);

             var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
             return (tokenString, expires);
         }
     }