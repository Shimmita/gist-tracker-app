// fetches the gists data via the API
export const fetchGists = async (
    page: number = 1,
    perPage: number = 8
  ) => {
    try {
        // the url or link to the github gists
      const url = `https://api.github.com/gists/public?page=${page}&per_page=${perPage}`;
      //when data fetched is saved in the response
      const response = await fetch(url);
  
      if (!response.ok) throw new Error("Failed to fetch gists");
      //makes the response converted to json object for easier destructuring.
      return await response.json();
    } catch (error) {
        // displaying the results on the server side component
      console.error("Error fetching gists:", error);

    //   returning empty array, means n data fetchedby the api
      return [];
    }
  };
  