namespace ATM.Application.DTOs.Transaction
{
    public class TransactionResponse
    {
        public string TransactionReference { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public decimal BalanceBefore { get; set; }
        public decimal BalanceAfter { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Status { get; set; }
    }
}
