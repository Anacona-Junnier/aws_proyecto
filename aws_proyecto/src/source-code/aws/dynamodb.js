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
    //crear los datos en la DynamoDB
    const command = new PutCommand(params);
    await dynamodb.send(command);
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

const updateCompanyData = async (data) => {
  try {
    const id_publicaciones = data.id_publicaciones;
    const corte_parcial = data.corte_parcial;
    const fecha_publicacion = data.fecha_publicacion;
    const id_imagen = data.id_imagen;
    const titulo = data.titulo;
    const params = {
      TableName: DYNAMODB_TABLE,
      Key: {
        id_publicaciones,
      
      },
      
      UpdateExpression: `set corte_parcial = :cp, fecha_publicacion = :fp, id_imagen = :i, titulo = :tl `,
                       // "SET RelatedItems = :ri, ProductReviews = :pr",
      ExpressionAttributeValues: {
        ":cp": corte_parcial,
        ":fp": fecha_publicacion,
        ":i": id_imagen,
        ":tl": titulo,

      },
    };
    console.info({ msg: "PARAMS", params });

    await dynamodb.update(params);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  getDynamoDBItem,
  putDynamoDBItem,
  deleteDynamoDBItem,
  updateCompanyData,
};
