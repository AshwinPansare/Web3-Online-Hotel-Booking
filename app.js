var contract;
$(document).ready(function(){
    web3 = new Web3(web3.currentProvider);

    var address = "0x6Ab59A43283B3Dc37a047bBDCd8f0290CDb8230b";
            
    var abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "addRoom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_roomId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numofdays",
				"type": "uint256"
			}
		],
		"name": "bookRoom",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_roomId",
				"type": "uint256"
			}
		],
		"name": "checkoutroom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "rev_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "room_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "reviews",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "stars",
				"type": "uint256"
			}
		],
		"name": "giveReviews",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "bookedRooms",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rev",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "rev_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "room_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "reviews",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "stars",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reviewcount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rooms",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "hotel_name",
				"type": "string"
			},
			{
				"internalType": "address payable",
				"name": "roomOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "customer",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totRooms",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
    
    var tot_rooms, booked_rooms;

    contract = new web3.eth.Contract(abi,address);

            //contract.methods.totRooms().call().then(console.log);
    contract.methods.totRooms().call().then(
        (value) => {

            $("#totrooms").text("Total rooms: "+value);
            tot_rooms=value;

        }
    )
    contract.methods.bookedRooms().call().then(
        (value)=> {

        $("#bookedrooms").text("Booked rooms: "+value);
        booked_rooms=value;

    })

    //.load(function(){})  is deprecated

    //console.log(contract.methods.rooms(1).call().then((room)=>{room.status})==="available");

    //web3.eth.getAccounts().then(console.log);
            // $("#bookedrooms").text(contract.bookedRooms);
    
    var owner;


    $("#add").click(function(){
        web3.eth.getAccounts().then(function(accounts)
        {
            owner = accounts[0];
            console.log(owner);
            return contract.methods.addRoom("Room "+(tot_rooms+1)).send({from: owner});
        }).then(function()
        {
            tot_rooms++;
            $("#totrooms").text("Total rooms: "+tot_rooms);
        })
    })

    $("#roomstat").click(function(){
        $("#roomtab").show();
        $("#roomstat").hide();
        $("#noroomstat").show();
        if($("#roomtab tr").length==(parseInt(tot_rooms)+1))
        {
            return;
        }
        else{
            for (let i = 1; i <= tot_rooms; i++) {
                if(contract.methods.rooms(i).call().then((room)=>{room.status=="available";}))
                {
                    $("#roomtab").append('<tr><td>Room '+i+'</td><td class="available">Available</td></tr>');
                }else{
                    $("#roomtab").append('<tr><td>Room '+i+'</td><td class="notavail">Not Available</td></tr>');
                }
            } 
        }   
    })
    $("#noroomstat").click(function(){
        $("#roomtab").hide();
        $("#roomstat").show();
        $("#noroomstat").hide();
    })

    $("#book").click(function(){
        var numdays=parseInt($("#numdays").value);
        var roomnum=parseInt($("roomnum").value);
        web3.eth.getAccounts().then(function(accounts)
        {
            customer = accounts[0];
            console.log(customer);
            return contract.methods.bookRoom(roomnum,numdays).send({from: customer});
        }).then(function()
        {
            booked_rooms++;
            $("#bookedrooms").text("Booked rooms: "+booked_rooms);
        })
    })
})