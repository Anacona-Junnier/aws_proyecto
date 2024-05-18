const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocument, 
  GetCommand,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { AWS_REGION, DYNAMODB_TABLE } = require("../utils/constants");

const dynamodbClient = new DynamoDB({ region: AWS_REGION });
const dynamodb = DynamoDBDocument.from(dynamodbClient);

const getDynamoDBItem = async (key) => {
  const params = {
    TableName: DYNAMODB_TABLE,
    Key: key,
  };
  console.info("GET PARAMS", params);

  try {
    //constantes para obtener los datos de DynamoDB
    const command = new GetCommand(params);
    const response = await dynamodb.send(command);

    //validacion de datos existentes
    if (response.Item) {
      return response.Item;
    } else {
      return "Datos NO encontrados";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const putDynamoDBItem = async (item) => {
  const params = {
    TableName: DYNAMODB_TABLE,
    Item: item,
  };
  console.info("PUT PARAMS", params);

  try {
    //return params.Item.id_publicaciones;
    //crear los datos en la DynamoDB
    const command = new PutCommand(params);
    await dynamodb.send(command);

    //comprobar que se han creado los datos
    //const command = new GetCommand(params.Item.id_publicaciones);
    //const response = await dynamodb.send(command);
    //return response;
    /*if (response.Item) {
      return response.Item;
    } else {
      return response.Item;
    }*/
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteDynamoDBItem = async (key) => {
  const params = {
    TableName: DYNAMODB_TABLE,
    Key: key,
  };
  console.info("DELETE PARAMS", params);

  try {
    //consulta de elementos
    const comandoGet = new GetCommand(params);
    const respuesta = await dynamodb.send(comandoGet);

    //validar item existente para eliminar
    if (respuesta.Item) {
      const command = new DeleteCommand(params);
      await dynamodb.send(command);
      return "Datos eliminados";
    } else {
      return "Datos NO eliminados";
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getDynamoDBItem,
  putDynamoDBItem,
  deleteDynamoDBItem,
};
