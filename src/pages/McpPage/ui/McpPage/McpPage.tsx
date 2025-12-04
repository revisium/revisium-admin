import { Accordion, Box, Code, Flex, IconButton, Link, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { PiCopyLight } from 'react-icons/pi'
import { McpPageViewModel } from 'src/pages/McpPage/model/McpPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page, toaster } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

const FEATURES = [
  {
    title: 'Project Setup',
    examples: ['"I need a blog platform"', '"Set up an e-commerce store"', '"Create a task management system"'],
  },
  {
    title: 'Schema Management',
    examples: ['"Add user profiles with avatars"', '"I need to track order history"', '"Add tags to posts"'],
  },
  {
    title: 'Data Operations',
    examples: ['"Add some sample products"', '"Show me all published posts"', '"Update prices for the summer sale"'],
  },
  {
    title: 'Version Control',
    examples: ['"What did I change?"', '"Save my changes"', '"Undo everything"'],
  },
  {
    title: 'API Endpoints',
    examples: [
      '"Create a GraphQL endpoint"',
      '"Show me the API schema"',
      '"Help me write a query to get all posts with their authors"',
    ],
  },
]

export const McpPage = observer(() => {
  const model = useViewModel(McpPageViewModel)

  const handleCopyUrl = useCallback(() => {
    model.copyUrl()
    toaster.info({ duration: 1500, description: 'Copied to clipboard' })
  }, [model])

  const handleCopyConfig = useCallback(() => {
    model.copyConfig()
    toaster.info({ duration: 1500, description: 'Configuration copied to clipboard' })
  }, [model])

  const handleCopyCommand = useCallback((text: string) => {
    void navigator.clipboard.writeText(text)
    toaster.info({ duration: 1500, description: 'Copied to clipboard' })
  }, [])

  const cliAddCommand = `claude mcp add --transport http ${model.serverName} ${model.mcpUrl}`

  return (
    <Page sidebar={<ProjectSidebar />}>
      <Box mb="4rem">
        <Text fontSize="20px" fontWeight="600" color="newGray.500" marginBottom="0.5rem">
          MCP Server
        </Text>
        <Text fontSize="xs" color="newGray.400" marginBottom="1.5rem">
          Connect AI assistants to manage your Revisium data using natural language.
        </Text>

        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={2}>
            What is MCP?
          </Text>
          <Text fontSize="xs" color="newGray.400" lineHeight="1.6" mb={2}>
            MCP (Model Context Protocol) is an open standard that enables AI assistants to securely interact with
            external data sources. With Revisium MCP server, you can use natural language to manage your projects,
            schemas, and data directly from any MCP-compatible AI assistant.
          </Text>
          <Text fontSize="xs" color="newGray.400" lineHeight="1.6">
            MCP servers expose <strong>tools</strong> — functions that AI can call on your behalf. Revisium provides
            tools for managing projects, tables, rows, branches, and API endpoints.
          </Text>
        </Box>

        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={3}>
            What You Can Do
          </Text>

          <VStack align="stretch" gap={4}>
            {FEATURES.map((feature) => (
              <Box key={feature.title}>
                <Text fontSize="xs" fontWeight="500" color="newGray.500" mb={1}>
                  {feature.title}
                </Text>
                <VStack align="stretch" gap={1}>
                  {feature.examples.map((example, idx) => (
                    <Text key={idx} fontSize="xs" color="newGray.400" fontStyle="italic">
                      {example}
                    </Text>
                  ))}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>

        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={3}>
            Connection
          </Text>

          <VStack align="stretch" gap={3}>
            <Box className="group">
              <Flex align="center" gap={2}>
                <Text fontSize="sm" color="newGray.400" minWidth="100px">
                  MCP URL
                </Text>
                <Link
                  href={model.mcpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  fontSize="xs"
                  color="newGray.400"
                  fontFamily="mono"
                >
                  {model.mcpUrl}
                </Link>
                <IconButton
                  aria-label="Copy URL"
                  size="xs"
                  variant="plain"
                  color="newGray.400"
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  onClick={handleCopyUrl}
                >
                  <PiCopyLight />
                </IconButton>
              </Flex>
            </Box>

            <Box>
              <Flex align="center" gap={2}>
                <Text fontSize="sm" color="newGray.400" minWidth="100px">
                  Server Name
                </Text>
                <Code fontSize="xs" color="newGray.500" bg="newGray.50" px={2} py={0.5} borderRadius="sm">
                  {model.serverName}
                </Code>
              </Flex>
            </Box>
          </VStack>
        </Box>

        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={3}>
            Setup with Claude Code
          </Text>

          <Accordion.Root collapsible defaultValue={['cli']}>
            <Accordion.Item value="cli" borderWidth="0">
              <Accordion.ItemTrigger
                cursor="pointer"
                py={2}
                _hover={{ bg: 'newGray.50' }}
                fontSize="xs"
                color="newGray.500"
                fontWeight="500"
                borderRadius="sm"
                px={2}
                mx={-2}
              >
                <Box flex="1" textAlign="left">
                  Option 1: Claude Code CLI
                </Box>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <VStack align="stretch" gap={3} pt={2} pb={2}>
                  <Box>
                    <Text fontSize="xs" color="newGray.400" mb={2}>
                      Add the MCP server using <Code fontSize="xs">mcp add</Code> command, where{' '}
                      <Code fontSize="xs">{model.serverName}</Code> is a unique name for this server:
                    </Text>
                    <Box position="relative" className="group">
                      <Code
                        display="block"
                        whiteSpace="pre"
                        p={3}
                        fontSize="xs"
                        bg="newGray.50"
                        borderRadius="md"
                        overflow="auto"
                      >
                        {cliAddCommand}
                      </Code>
                      <IconButton
                        aria-label="Copy command"
                        size="xs"
                        variant="plain"
                        color="newGray.400"
                        position="absolute"
                        top={2}
                        right={2}
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        onClick={() => handleCopyCommand(cliAddCommand)}
                      >
                        <PiCopyLight />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="newGray.400" mb={2}>
                      Manage your MCP servers:
                    </Text>
                    <Code
                      display="block"
                      whiteSpace="pre"
                      p={3}
                      fontSize="xs"
                      bg="newGray.50"
                      borderRadius="md"
                      overflow="auto"
                      color="newGray.500"
                    >
                      {`# List configured servers
claude mcp list

# View server details and available tools
claude mcp show ${model.serverName}

# Remove server
claude mcp remove ${model.serverName}`}
                    </Code>
                  </Box>
                </VStack>
              </Accordion.ItemContent>
            </Accordion.Item>

            <Accordion.Item value="config" borderWidth="0">
              <Accordion.ItemTrigger
                cursor="pointer"
                py={2}
                _hover={{ bg: 'newGray.50' }}
                fontSize="xs"
                color="newGray.500"
                fontWeight="500"
                borderRadius="sm"
                px={2}
                mx={-2}
              >
                <Box flex="1" textAlign="left">
                  Option 2: Configuration File
                </Box>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <VStack align="stretch" gap={3} pt={2} pb={2}>
                  <Box>
                    <Text fontSize="xs" color="newGray.400" mb={2}>
                      Add to your MCP configuration file (e.g., ~/.claude.json for Claude Code):
                    </Text>
                    <Box position="relative" className="group">
                      <Code
                        display="block"
                        whiteSpace="pre"
                        p={3}
                        fontSize="xs"
                        bg="newGray.50"
                        borderRadius="md"
                        overflow="auto"
                      >
                        {model.claudeConfigSnippet}
                      </Code>
                      <IconButton
                        aria-label="Copy config"
                        size="xs"
                        variant="plain"
                        color="newGray.400"
                        position="absolute"
                        top={2}
                        right={2}
                        opacity={0}
                        _groupHover={{ opacity: 1 }}
                        onClick={handleCopyConfig}
                      >
                        <PiCopyLight />
                      </IconButton>
                    </Box>
                  </Box>
                </VStack>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>

          <Box mt={4} pt={4} borderTopWidth="1px" borderColor="newGray.100">
            <Text fontSize="xs" fontWeight="500" color="newGray.500" mb={2}>
              Authentication
            </Text>
            <Text fontSize="xs" color="newGray.400">
              When you start working with the MCP server, you will be prompted to authenticate using one of the
              available methods.
            </Text>
          </Box>
        </Box>
      </Box>
    </Page>
  )
})
