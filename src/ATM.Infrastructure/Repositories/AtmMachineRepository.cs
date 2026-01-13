using ATM.Application.Interfaces.Repositories;
using ATM.Domain.Entities;
using ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Repositories
{
    public class AtmMachineRepository : GenericRepository<AtmMachine>, IAtmMachineRepository
    {
        public AtmMachineRepository(AtmDbContext context) : base(context) { }

        public async Task<AtmMachine> GetByMachineCodeAsync(string machineCode)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.MachineCode == machineCode);
        }
    }
}
