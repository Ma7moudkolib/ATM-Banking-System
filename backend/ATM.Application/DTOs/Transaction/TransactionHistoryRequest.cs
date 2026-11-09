namespace Backend.ATM.Application.DTOs.Transaction
{
    public class TransactionHistoryRequest
    {
        public Guid SessionId { get; set; }
        public DateTime? FromDate { get; set; } = DateTime.MinValue;
        public DateTime? ToDate { get; set; } = DateTime.MaxValue;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
