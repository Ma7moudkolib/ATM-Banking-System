using ATM.Domain.Entities;

namespace ATM.Application.Interfaces.Repositories
{
    public interface IAtmMachineRepository : IGenericRepository<AtmMachine>
    {
        Task<AtmMachine> GetByMachineCodeAsync(string machineCode);
    }
}
