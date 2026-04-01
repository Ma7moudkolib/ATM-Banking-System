using Backend.ATM.Application.Interfaces.Repositories;
using Backend.ATM.Domain.Entities;
using Backend.ATM.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Backend.ATM.Infrastructure.Repositories
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
