const fs = require('fs');

const deleteFile = (filePath)=>{
    fs.unlink(filePath,(err)=>{
        if(err){
            throw new Error('no file found');
        }
    });
};

exports.deleteFile = deleteFile;