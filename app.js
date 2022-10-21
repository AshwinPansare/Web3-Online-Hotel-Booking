var contract;
$(document).ready(function(){
    web3 = new Web3(web3.currentProvider);

    //connecting the contract
	var address = "0x5503632Ed9A395819d14c3e6F712bE7b32002873";
            
    var abi =
		[
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
    
    var tot_rooms, booked_rooms, avail_rooms;

    contract = new web3.eth.Contract(abi,address);

            //contract.methods.totRooms().call().then(console.log);
    contract.methods.totRooms().call().then(
        (value) => {

            $("#totrooms").text("Total rooms: "+value);
            tot_rooms=value;
			console.log(tot_rooms);
        }
    )
    contract.methods.bookedRooms().call().then(
        (value)=> {

        $("#bookedrooms").text("Booked rooms: "+value);
        booked_rooms=value;
		console.log(booked_rooms);
		avail_rooms=tot_rooms-booked_rooms;
		console.log(avail_rooms);
    })

    //.load(function(){})  is deprecated

    //console.log(contract.methods.rooms(1).call().then((room)=>{room.status})==="available");

    //web3.eth.getAccounts().then(console.log);
            // $("#bookedrooms").text(contract.bookedRooms);
    
    var owner,customer;

    $("#add").click(function(){
        web3.eth.getAccounts().then(function(accounts)
        {
            owner = accounts[0];
            console.log(owner);
            return contract.methods.addRoom("Room "+(parseInt(tot_rooms)+1)).send({from: owner});
        }).then(function()
        {
            tot_rooms++;
			avail_rooms++;
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
			$("#roomtab").find("tr:gt(0)").remove();//remove all rows except head
            for (let i = 1; i <= tot_rooms; i++) {
                if(contract.methods.rooms(i).call().then((value)=>{value.status=="available";}))
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

	//index
	var room,roomrev;
	$("#availrooms").click(async function(){
        $("#availroomtab").show();
        $("#availrooms").hide();
        $("#noavailrooms").show();

        if($("#availroomtab tr").length==(parseInt(avail_rooms)+1))
        {
            return;
        }
        else{
			$("#availroomtab").find("tr:gt(0)").remove();
            for (let i = 1; i <= tot_rooms; i++) {
                if(contract.methods.rooms(i).call().then((value)=>{value.status=="available";}))
                {
					room = await contract.methods.rooms(i).call();
					roomrev = await contract.methods.rev(room.id,1).call();
					if(roomrev.rev_id==0)
					$("#availroomtab").append('<tr><td>'+room.hotel_name+'</td><td>'+room.name+'</td><td>'+(room.price/1000000000000000000)+'</td><td>No review available</td></tr>');
					else
					{
					$("#availroomtab").append('<tr><td>'+room.hotel_name+'</td><td>'+room.name+'</td><td>'+(room.price/1000000000000000000)+'</td><td><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span></td></tr>');
					}
                }
            } 
        }   
    })
    $("#noavailrooms").click(function(){
        $("#availroomtab").hide();
        $("#availrooms").show();
        $("#noavailrooms").hide();
    })
	var numdays,roomnum;
    $("#book").click(async function(){
        numdays=($("#numdays").val());
        roomnum=($("#roomnum").val());
		room = await contract.methods.rooms(roomnum).call();
		const amt = room.price*numdays;
        web3.eth.getAccounts().then(function(accounts)
        {
            customer = accounts[0];
            console.log(customer);
            return contract.methods.bookRoom(roomnum,numdays).send({from: customer, value: amt});
        }).then(function()
        {
            booked_rooms++;
            $("#bookedrooms").text("Booked rooms: "+booked_rooms);
			$("#booking").hide();
			$("#review").show();
        })
    })
	var rev_count;
	$("#subfb").click(async function(){
		var star = $("input[name='stars']:checked").val();
		var feedback = $("#feedback").val();
		rev_count = await contract.methods.reviewcount().call();
		rev_count++;
		contract.methods.giveReviews(rev_count,room.id,feedback,star).send({from: customer}).then(function(){
			$("#review").hide();
			$("#checkout").show();
		})
	})
	$("#checkoutbut").click(function(){
		contract.methods.checkoutroom(room.id).send({from: customer}).then(function()
    	{
            booked_rooms--;
			avail_rooms++;
            $("#totrooms").text("Total rooms: "+booked_rooms);
			$("#checkout").hide();
			$("#booking").show();
   		})
	})
})
