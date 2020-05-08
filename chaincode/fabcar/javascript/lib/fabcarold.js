/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const media = [
            {
                type: 'movie',
                make: 'Harry_Potter',
                distributor: 'Disney',
                owner: 'Tomoko',
            },
            {
                type: 'movie',
                make: 'Frozen',
                distributor: 'Warner',
                owner: 'Brad',
            },
            {
                type: 'movie',
                make: 'Bad_Boys',
                distributor: 'Fox',
                owner: 'Jin Soo',
            },
            {
                type: 'yellow',
                make: 'Volkswagen',
                distributor: 'Passat',
                owner: 'Max',
            },
            {
                type: 'black',
                make: 'Tesla',
                distributor: 'S',
                owner: 'Adriana',
            },
            {
                type: 'purple',
                make: 'Peugeot',
                distributor: '205',
                owner: 'Michel',
            },
            {
                type: 'white',
                make: 'Chery',
                distributor: 'S22L',
                owner: 'Aarav',
            },
            {
                type: 'violet',
                make: 'Fiat',
                distributor: 'Punto',
                owner: 'Pari',
            },
            {
                type: 'indigo',
                make: 'Tata',
                distributor: 'Nano',
                owner: 'Valeria',
            },
            {
                type: 'brown',
                make: 'Holden',
                distributor: 'Barina',
                owner: 'Shotaro',
            },
        ];

        for (let i = 0; i < media.length; i++) {
            media[i].docType = 'car';
            await ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(media[i])));
            console.info('Added <--> ', media[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryCar(ctx, carNumber) {
        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }

    async createCar(ctx, carNumber, make, distributor, type, owner) {
        console.info('============= START : Create Car ===========');

        const car = {
            type,
            docType: 'car',
            make,
            distributor,
            owner,
        };

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : Create Car ===========');
    }

    async queryAllmedia(ctx) {
        const startKey = 'CAR0';
        const endKey = 'CAR999';

        const iterator = await ctx.stub.getStateByRange(startKey, endKey);

        const allResults = [];
        while (true) {
            const res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                console.log(res.value.value.toString('utf8'));

                const Key = res.value.key;
                let Record;
                try {
                    Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = res.value.value.toString('utf8');
                }
                allResults.push({ Key, Record });
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return JSON.stringify(allResults);
            }
        }
    }

    async changeCarOwner(ctx, carNumber, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(carNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${carNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

}

module.exports = FabCar;
