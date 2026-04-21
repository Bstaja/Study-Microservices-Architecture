const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('./company.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const { producer } = require('./kafka');

async function getCompanyValue(call, callback)
{
    const name = call.request.name;
    console.log(`Company service reqested value from ${name} via gRPC`);
    callback(null, {value: '{"Estimated value":"$USD 70,000,000"}'});
    await producer.send
    ({
        topic: 'company-info',
        messages: [{value: `{"Company":"${name}", "Nr. of employees": "25,000"}`}]
    });
}

function startGrpcServer()
{
    const server = new grpc.Server();

    server.addService(grpcObject.CompanyService.service, { GetCompanyValue: getCompanyValue });

    server.bindAsync('0.0.0.0:3003', grpc.ServerCredentials.createInsecure(), () =>
    {
        console.log('gRPC server from client-service is listening on port 3003');
        server.start();
    });
}

module.exports = startGrpcServer;