const express = require("express"); //para crear servidores web
const multer = require("multer"); //recibir y procesar los archivos
const { StatusCodes } = require("http-status-codes"); //para estados del codigo como 200 OK, 404 no encontrado, 403...

const upload = multer({ storage: multer.memoryStorage() }); //memoryStorage almacena los archivos temporalmente en la memoria del servidor

// importa tres funciones del modulo ../aws/dynamodb en los variables especificadas
const {
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
} = require("../aws/dynamodb");

// importa cinco funciones del modulo ../aws/s3 en las variables especificadas
const {
  uploadS3File,
  ListS3Files,
  getS3File,
  deleteS3File,
  uploadS3SignedUrl,
} = require("../aws/s3");

const api = express.Router(); //crea un enrutador que permite crear, agrupar y organizar rutas

api.get("/obtener/:id_publicaciones", async (request, response) => {
  try {
    console.info("params", request.params);

    const id_publicaciones = request.params.id_publicaciones;

    const dynamoDBItem = await getDynamoDBItem({ id_publicaciones });
    console.info(`DynamoDB Item With ID ${id_publicaciones}`, dynamoDBItem);

    response.status(StatusCodes.OK).json(dynamoDBItem);
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.delete("/eliminar/:id_publicaciones", async (request, response) => {
  try {
    console.info("params", request.params);

    const id_publicaciones = request.params.id_publicaciones;

    const mensajeRetorno = await deleteDynamoDBItem({ id_publicaciones });

    response.status(StatusCodes.OK).json({ mensajeRetorno });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.put("/crear", async (request, response) => {
  try {
    console.info("BODY", request.body);

    const datosPublicacion = request.body;

    //llamando funcion puDynamoDBItem del archivo dynamodb.js y retorna un mensaje
    await putDynamoDBItem(datosPublicacion);

    //respuesta del servidor
    response.status(StatusCodes.OK).json({ msg: "Datos creados exitosamente" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.post("/path1", async (request, response) => {
  try {
    console.info("BODY", request.body);

    const item = {
      ...request.body,
      visible: true,
    };

    // Put the item in DynamoDB
    await putDynamoDBItem(item);

    // Get the item from DynamoDB
    const dynamoDBItem = await getDynamoDBItem({ id: item.id });
    console.info(`DynamoDB Item With ID ${item.id}`, dynamoDBItem);

    // Delete the item from DynamoDB
    await deleteDynamoDBItem({ id: item.id });

    response.status(StatusCodes.OK).json({ msg: "Hello from path1" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.post("/path2", upload.single("file"), async (request, response) => {
  try {
    console.info("BODY", request.file);

    const fileInfo = request.file;
    console.info("FILE INFO", fileInfo);

    const { originalname, buffer, mimetype } = fileInfo;

    // Upload a file to S3
    await uploadS3File({ key: originalname, buffer, mimetype });

    // List all files from S3
    const s3Files = await ListS3Files();
    console.info("S3 Files", s3Files);

    // Get the file from S3
    const s3File = await getS3File(originalname);
    console.info(`S3 File With Name ${originalname}`, s3File);

    // Delete the file from S3
    await deleteS3File(originalname);

    response.status(StatusCodes.OK).json({ msg: "Hello from path2" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.post("/path3", async (request, response) => {
  try {
    console.info("BODY", request.body);

    const { fileName } = request.body;
    const presignedUrl = await uploadS3SignedUrl(fileName);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path3", presignedUrl });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

module.exports = api;
