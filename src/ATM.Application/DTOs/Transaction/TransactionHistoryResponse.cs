namespace ATM.Application.DTOs.Transaction
{
    public class TransactionHistoryResponse
    {
        public List<TransactionResponse> Transactions { get; set; }
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
