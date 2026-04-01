using Backend.ATM.Domain.Entities;

namespace Backend.ATM.Application.Interfaces.Repositories
{
    public interface IAtmMachineRepository : IGenericRepository<AtmMachine>
    {
        Task<AtmMachine> GetByMachineCodeAsync(string machineCode);
    }
}
