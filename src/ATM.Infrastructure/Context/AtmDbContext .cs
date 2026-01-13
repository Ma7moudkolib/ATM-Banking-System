using ATM.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ATM.Infrastructure.Context
{
    public class AtmDbContext : DbContext
    {
        public AtmDbContext(DbContextOptions<AtmDbContext> options) : base(options) { }

        public DbSet<Card> Cards { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<LedgerEntry> LedgerEntries { get; set; }
        public DbSet<AtmMachine> AtmMachines { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Card Configuration
            modelBuilder.Entity<Card>( entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.OwnsOne(e => e.CardNumber,cardNumber =>
                {
                    cardNumber.Property(cn => cn.Value)
                        .HasMaxLength(19)
                        .IsRequired()
                        .HasColumnName("CardNumber");
                });

                entity.OwnsOne(e => e.Pin, pin =>
                {
                    pin.Property(p => p.HashedValue)
                        .HasColumnName("HashedPin")
                        .HasMaxLength(255)
                        .IsRequired();
                });

                entity.Property(e => e.Status).HasConversion<string>();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt);

                entity.HasIndex(e => e.CardNumber.Value).IsUnique();
                entity.HasIndex(e => e.AccountId);

                entity.HasOne(e => e.Account)
                    .WithMany(a => a.Cards)
                    .HasForeignKey(e => e.AccountId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Account Configuration
            modelBuilder.Entity<Account>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.AccountNumber)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(e => e.CustomerName)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(e => e.Balance)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Currency)
                    .HasMaxLength(3)
                    .IsRequired();

                entity.Property(e => e.Status).HasConversion<string>();

                entity.Property(e => e.Version)
                    .IsConcurrencyToken()
                    .IsRequired();

                entity.HasIndex(e => e.AccountNumber).IsUnique();
            });

            // Transaction Configuration
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.TransactionReference)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Type).HasConversion<string>();
                entity.Property(e => e.Status).HasConversion<string>();

                entity.Property(e => e.Amount)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Currency)
                    .HasMaxLength(3)
                    .IsRequired();

                entity.Property(e => e.BalanceBefore)
                    .HasPrecision(18, 2);

                entity.Property(e => e.BalanceAfter)
                    .HasPrecision(18, 2);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.HasIndex(e => e.TransactionReference).IsUnique();
                entity.HasIndex(e => e.AccountId);
                entity.HasIndex(e => e.CreatedAt);

                entity.HasOne(e => e.Account)
                    .WithMany(a => a.Transactions)
                    .HasForeignKey(e => e.AccountId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Card)
                    .WithMany()
                    .HasForeignKey(e => e.CardId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.AtmMachine)
                    .WithMany()
                    .HasForeignKey(e => e.AtmMachineId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // LedgerEntry Configuration
            modelBuilder.Entity<LedgerEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.EntryType).HasConversion<string>();

                entity.Property(e => e.Amount)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.Currency)
                    .HasMaxLength(3)
                    .IsRequired();

                entity.Property(e => e.BalanceAfter)
                    .HasPrecision(18, 2);

                entity.Property(e => e.Description)
                    .HasMaxLength(500);

                entity.HasIndex(e => e.TransactionId);
                entity.HasIndex(e => e.AccountId);
                entity.HasIndex(e => e.EntryDate);

                entity.HasOne(e => e.Transaction)
                    .WithMany()
                    .HasForeignKey(e => e.TransactionId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Account)
                    .WithMany()
                    .HasForeignKey(e => e.AccountId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // AtmMachine Configuration
            modelBuilder.Entity<AtmMachine>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.MachineCode)
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(e => e.Location)
                    .HasMaxLength(200)
                    .IsRequired();

                entity.Property(e => e.Status).HasConversion<string>();

                entity.Property(e => e.CashAvailable)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.Property(e => e.MaxWithdrawalAmount)
                    .HasPrecision(18, 2)
                    .IsRequired();

                entity.HasIndex(e => e.MachineCode).IsUnique();
            });

            // AuditLog Configuration
            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.EntityType)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Action)
                    .HasMaxLength(100)
                    .IsRequired();

                entity.Property(e => e.Changes)
                    .HasMaxLength(2000);

                entity.Property(e => e.PerformedBy)
                    .HasMaxLength(200);

                entity.Property(e => e.IpAddress)
                    .HasMaxLength(50);

                entity.HasIndex(e => e.EntityId);
                entity.HasIndex(e => e.Timestamp);
            });
        }
    }
}
