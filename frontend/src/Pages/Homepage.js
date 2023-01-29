import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  // use the useHistory hook to access the browser history
  const history = useHistory();

  useEffect(() => {
    // check if there is a user in local storage 
    const user = JSON.parse(localStorage.getItem("userInfo"));

    // if there is a user, redirect to the /chats route //
    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent >
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>

            <TabPanel>
              {/* render login form component */}
              <Login />
            </TabPanel>

            <TabPanel>
              {/* render signup form component */}
              <Signup />
            </TabPanel>

          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;
