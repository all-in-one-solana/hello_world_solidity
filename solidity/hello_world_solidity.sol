
@program_id("B3ajjazFqTpjBV7nyRozAQYScn3HhNGTLnkvvHo5FUo2")
contract hello_world_solidity {
    bool private value = true;

    // A private instance of the AddressInfo struct
    // This is the data that is stored in the account
    AddressInfo private addressInfo;

    // The AddressInfo struct definition
    struct AddressInfo {
        string name;
        uint8 houseNumber;
        string street;
        string city;
    }

    // The constructor is used to create a new account
    // Here we create a new account that stores no data and only prints messages to the program logs when the constructor is called.
    @payer(payer) // The "payer" pays for the account creations
    constructor(address payer) {
        // We get the program ID by calling 'type(hello_world_solidity).program_id', where "hello_solana" is the name of the contract.
        address programId = type(hello_world_solidity).program_id;

        // Print messages to the program logs
        print("Hello, Solana!");
        print("Our program's Program ID: {:}".format(programId));
        //(todo davirain) The account's address is the first 32 bytes of the sha256 hash of the program ID and the account's data
        print("The account's address: {:}".format(address(this)));
        print("The payer's address: {:}".format(address(payer)));
    }

    /// A message that can be called on instantiated contracts.
    /// This one flips the value of the stored `bool` from `true`
    /// to `false` and vice versa.
    function flip() public {
            value = !value;
    }

    /// Simply returns the current value of our `bool`.
    function get() public view returns (bool) {
            return value;
    }
}
