  using OnlineStore.Core.Entities;

  namespace OnlineStore.Core.Interfaces;

  public interface IUserRepository : IRepository<User>
  {
      Task<User?> GetByEmailAsync(string email);
      Task<IEnumerable<User>> SearchAsync(string term);
  }