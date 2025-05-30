export const handler = async (event: any): Promise<any> => {
  // Log the event object
  console.log('S3 Event:', JSON.stringify(event, null, 2));
  
  // Extract S3 object information
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const size = event.Records[0].s3.object.size;
  
  console.log(`File uploaded: ${key} (${size} bytes) to bucket: ${bucket}`);
};