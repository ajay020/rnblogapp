export function generateUniqueImageName() {
  // Get the current timestamp
  const timestamp = new Date().getTime();

  // Generate a random string (e.g., 6 characters)
  const randomString = Math.random().toString(36).substring(7);

  // Combine the timestamp and random string to create a unique name
  const uniqueName = `${timestamp}_${randomString}`;

  // Append a file extension (e.g., .jpg) if needed
  // const uniqueNameWithExtension = `${uniqueName}.jpg`;

  return uniqueName;
}
