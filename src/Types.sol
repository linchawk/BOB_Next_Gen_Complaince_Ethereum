enum KYCClientBusinessType {
	Bank,
	Legal_Firm,
	Tax_Department,
	News_Channel,
	Other		
}
enum CustomerKYCStatus {
	Initiated,
	InProgress,
	IPVRequested,
	Verified,
	Rejected
}
enum NetworkEvent {
	Normal,
	Change,
	Alert
}
struct KYCClient {
	string name;
	string _address;
	KYCClientBusinessType businessType;
	uint256 balance;
	uint256 modifiedTime;
}
struct Customer {
	string name;
	string _address;
	string dob;
	bytes photo;
	customerKYCStatus status;
	string comment;
	address modifiedBy;
	uint256 modifiedTime;	
}