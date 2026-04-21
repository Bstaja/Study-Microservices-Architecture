const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDef = protoLoader.loadSync('./company.proto');
const grpcObject = grpc.loadPackageDefinition(packageDef);
const client = new grpcObject.CompanyService('client-service:3003', grpc.credentials.createInsecure());

module.exports = client;