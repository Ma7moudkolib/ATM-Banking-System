namespace ATM.Application.DTOs.Transaction
{
    public class DepositRequest
    {
        public Guid SessionId { get; set; }
        public decimal Amount { get; set; }
        public string AtmMachineCode { get; set; }
    }
}
