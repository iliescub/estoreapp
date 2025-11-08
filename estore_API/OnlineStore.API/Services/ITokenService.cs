 using OnlineStore.Core.Entities;

     namespace OnlineStore.API.Services;

     public interface ITokenService
     {
         (string Token, DateTime ExpiresAt) CreateToken(User user);
     }