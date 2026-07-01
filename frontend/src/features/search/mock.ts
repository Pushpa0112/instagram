export const searchUsers = async (query: string) => {
  // TODO: Replace with real API endpoint when Search API is built.
  // This is a stub function returning mock user results.
  
  if (!query) return [];

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockUsers = [
    { id: "1", username: "john_doe", fullName: "John Doe", avatar: "" },
    { id: "2", username: "jane_smith", fullName: "Jane Smith", avatar: "" },
    { id: "3", username: "johny_bravo", fullName: "Johny Bravo", avatar: "" },
  ];

  return mockUsers.filter(
    (user) => 
      user.username.toLowerCase().includes(query.toLowerCase()) || 
      user.fullName.toLowerCase().includes(query.toLowerCase())
  );
};
