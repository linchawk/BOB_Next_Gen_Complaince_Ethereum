pragma solidity ^0.4.2;

//import "./Types.sol";

contract KYCMaster {

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
		string businessType;
		uint256 balance;
		uint256 modifiedTime;
		bool registered;
	}
	struct Customer {
		string name;
		string _address;
		string dob;
		bytes photo;
		CustomerKYCStatus status;
		string comment;
		address modifiedBy;
		uint256 modifiedTime;	
	}

	struct LogMessage {
		uint256 timestamp;
		string msg;
	}

	/* Network rules */
	uint256 kycClientInitialDeposit = 10 ether;
	uint256 kycClientMinBalance = 1 ether;	

	mapping(address => KYCClient) kycClients;
	mapping(string => Customer[]) customers;
	mapping(address => LogMessage[]) kycClientLogs;

	/* KYCClient API */
	function KYCClient_Register(string name, string _address, string businessType) public payable returns (bool) {
		// Revert the call if the KYCClient already exists
		require(!kycClients[msg.sender].registered);
		// Revert the call if initial deposit money is less than required
		require(msg.value >= kycClientInitialDeposit);		
		kycClients[msg.sender] = KYCClient(name, _address, businessType, msg.value, now, true);
		kycClientLogs[msg.sender].push(LogMessage(now, "You registered with the network."));		
		return true;
	}

	function KYCClient_GetBalance() public returns (uint256) {
		return kycClients[msg.sender].balance;
	}

	function KYCClient_GetName() public returns (string) {
		return kycClients[msg.sender].name;
	}

	function KYCClient_GetLogs() public returns (LogMessage[]) {
		return kycClientLogs[msg.sender];
	}
}