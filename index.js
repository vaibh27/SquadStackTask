const fileReader = require("./readStream");

let numOfCars = 0;
let maxParkingSpace = 0;
let parkingSpace = {};
let licensePlateToSlot = {};
let driverAgeToSlots = {};
let emptySlot = [];

fileReader.on("line", function (line) {
    // spilting command into array for better access.
    let command = line.split(" ");
    switch (command[0]) {
        
        case "Create_parking_lot":
            maxParkingSpace = command[1];
            console.log(`Created parking of ${maxParkingSpace} slots`);
            break;

        case "Park":
            if (numOfCars == maxParkingSpace) {
                console.log("Parking Space is Full");
            } else {
                numOfCars++;
                let slot;
                let licensePlate = command[1];
                let age = command[3]


                // Checking for empty slots which were filled first
                if (emptySlot.length == 0) {
                    slot = numOfCars;
                } else {
                    slot = emptySlot.pop();
                }
                
                // adding detail for parking file
                parkingSpace[slot] = {
                    licensePlate: licensePlate,
                    age: age,
                };

                // adding the mapping for licenceplate to slot for fast access.
                licensePlateToSlot[licensePlate] = slot;

                // adding map fofr group for the drivers age and slot, which will be helpful for access all the cars and license number directly through it.
                if (driverAgeToSlots[age]) {
                    driverAgeToSlots[age].push(slot);
                } else {
                    driverAgeToSlots[age] = [slot];
                }

                console.log(`Car with vehicle registration number "${licensePlate} has been parked at slot number ${slot}`);
            }
            break;

        case "Slot_numbers_for_driver_of_age":
            let age = command[1];

            // checking if the we have slot with the respective age 
            if (driverAgeToSlots[age]) {
                console.log(driverAgeToSlots[age].join(","));
            } else {
                console.log("No Cars for the drivers age ", age);
            }

            break;

        case "Slot_number_for_car_with_number":

            let licensePlate = command[1];

            if (licensePlateToSlot[licensePlate]) {
                console.log(licensePlateToSlot[licensePlate]);
            } else {
                console.log("No Cars for the license plate ", licensePlate);
            }

            break;

        case "Leave":
            let slot = command[1];
            if (parkingSpace[slot]) {
                let licensePlateNum = parkingSpace[slot]["licensePlate"];
                let driveAge = parkingSpace[slot]["age"];
                let slots = driverAgeToSlots[driveAge];
                
                // remove the slot from the age group
                driverAgeToSlots[driveAge] = arrayRemove(slots, slot);
                delete licensePlateToSlot[licensePlateNum];
                
                // emptying the parking slot
                parkingSpace[slot] = {};
                console.log(
                    `Slot number ${slot} vacated, the car with vehicle registration number "${licensePlateNum}" left the space, the driver of the car was of age ${driveAge}`
                );
                emptySlot.push(slot)

            }else{
                if(slot > maxParkingSpace){
                    console.log('Slot is not available in parking space')
                }
                console.log(`Slot ${slot} is empty`)
            }

            break;

        case "Vehicle_registration_number_for_driver_of_age":
            let driversAge = command[1];

            if (!driverAgeToSlots[driversAge]) {
                console.log("No car found");
            } else {
                let allParkedCarsForAge = [];
                driverAgeToSlots[driversAge].forEach((slot) => {
                    allParkedCarsForAge.push(
                        parkingSpace[slot]["licensePlate"]
                    );
                });
                console.log(allParkedCarsForAge.join(","));
            }
            
            break;
        default:
            console.log('Invalid Command');
    }
});

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;

    });
}
