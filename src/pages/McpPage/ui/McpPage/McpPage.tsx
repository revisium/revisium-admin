import { Accordion, Box, Code, Flex, HStack, IconButton, Link, Text, VStack } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { useCallback } from 'react'
import { PiCopyLight } from 'react-icons/pi'
import { McpPageViewModel } from 'src/pages/McpPage/model/McpPageViewModel.ts'
import { useViewModel } from 'src/shared/lib'
import { Page, toaster } from 'src/shared/ui'
import { ProjectSidebar } from 'src/widgets/ProjectSidebar/ui/ProjectSidebar/ProjectSidebar.tsx'

const TOOL_GROUPS = [
  {
    title: 'Projects & Branches',
    tools: [
      { name: 'getProjects', desc: 'List all projects in organization' },
      { name: 'createProject', desc: 'Create new project' },
      { name: 'deleteProject', desc: 'Delete project' },
      { name: 'getBranch', desc: 'Get branch info with revision IDs' },
      { name: 'createBranch', desc: 'Create branch from revision' },
      { name: 'revertChanges', desc: 'Discard uncommitted changes' },
    ],
  },
  {
    title: 'Schema & Tables',
    tools: [
      { name: 'getTables', desc: 'List tables in revision' },
      { name: 'getTable', desc: 'Get table info' },
      { name: 'getTableSchema', desc: 'Get table JSON Schema definition' },
      { name: 'createTable', desc: 'Create table with schema' },
      { name: 'updateTable', desc: 'Modify schema using JSON Patch' },
      { name: 'renameTable', desc: 'Rename table ID' },
      { name: 'removeTable', desc: 'Delete table' },
    ],
  },
  {
    title: 'Data & Rows',
    tools: [
      { name: 'getRows', desc: 'Query rows (supports where/orderBy)' },
      { name: 'getRow', desc: 'Get single row by ID' },
      { name: 'createRow', desc: 'Insert new row' },
      { name: 'updateRow', desc: 'Replace entire row data' },
      { name: 'patchRow', desc: 'Update specific fields (JSON Patch)' },
      { name: 'renameRow', desc: 'Change row ID' },
      { name: 'removeRow', desc: 'Delete row' },
    ],
  },
  {
    title: 'Version Control',
    tools: [
      { name: 'getRevision', desc: 'Get revision details' },
      { name: 'getDraftRevision', desc: 'Get draft revision for editing' },
      { name: 'commitRevision', desc: 'Commit changes with comment' },
    ],
  },
  {
    title: 'Changes & Migrations',
    tools: [
      { name: 'getRevisionChanges', desc: 'View changes in revision' },
      { name: 'getTableChanges', desc: 'View table schema changes' },
      { name: 'getRowChanges', desc: 'View row data changes' },
      { name: 'getMigrations', desc: 'Get pending schema migrations' },
      { name: 'applyMigrations', desc: 'Apply migrations to branch' },
    ],
  },
  {
    title: 'Users',
    tools: [
      { name: 'getUser', desc: 'Get user by ID' },
      { name: 'searchUsers', desc: 'Search users by username or email' },
    ],
  },
]

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

        {/* What is MCP Section */}
        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={2}>
            What is MCP?
          </Text>
          <Text fontSize="xs" color="newGray.400" lineHeight="1.6">
            MCP (Model Context Protocol) is an open standard that enables AI assistants to securely interact with
            external data sources. With Revisium MCP server, you can use natural language to manage your projects,
            schemas, and data directly from any MCP-compatible AI assistant.
          </Text>
        </Box>

        {/* Connection Section */}
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

        {/* Setup Section */}
        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md" mb={4}>
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={3}>
            Setup with Claude Code
          </Text>

          <Accordion.Root collapsible defaultValue={['cli']}>
            {/* CLI Setup */}
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

# View server details
claude mcp show ${model.serverName}

# Remove server
claude mcp remove ${model.serverName}`}
                    </Code>
                  </Box>
                </VStack>
              </Accordion.ItemContent>
            </Accordion.Item>

            {/* Config File Setup */}
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

          {/* Authentication */}
          <Box mt={4} pt={4} borderTopWidth="1px" borderColor="newGray.100">
            <Text fontSize="xs" fontWeight="500" color="newGray.500" mb={2}>
              Authentication
            </Text>
            <Text fontSize="xs" color="newGray.400" mb={2}>
              When you start working with the MCP server, it will prompt you to authenticate. You can also initiate
              login yourself using the <Code fontSize="xs">login</Code> tool with your Revisium credentials:
            </Text>
            <Code fontSize="xs" p={2} bg="newGray.50" borderRadius="sm" display="block" mb={2}>
              login(email or username, password)
            </Code>
            <Text fontSize="xs" color="newGray.400">
              Verify connection with <Code fontSize="xs">me()</Code> — returns your user info if authenticated.
            </Text>
          </Box>
        </Box>

        {/* Features Section */}
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

        {/* Available Tools Section */}
        <Box p={4} borderWidth="1px" borderColor="newGray.100" borderRadius="md">
          <Text fontSize="sm" fontWeight="500" color="newGray.500" mb={3}>
            Available Tools
          </Text>

          <Accordion.Root collapsible defaultValue={[]}>
            {TOOL_GROUPS.map((group) => (
              <Accordion.Item key={group.title} value={group.title} borderWidth="0">
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
                  <HStack flex="1" textAlign="left" gap={2}>
                    <Text>{group.title}</Text>
                    <Text color="newGray.300" fontWeight="400">
                      ({group.tools.length})
                    </Text>
                  </HStack>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <VStack align="stretch" gap={1} pt={1} pb={2}>
                    {group.tools.map((tool) => (
                      <Flex key={tool.name} gap={3} fontSize="xs" py={0.5}>
                        <Code
                          fontSize="xs"
                          color="newGray.500"
                          bg="transparent"
                          p={0}
                          minWidth="140px"
                          fontWeight="500"
                        >
                          {tool.name}
                        </Code>
                        <Text color="newGray.400">{tool.desc}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Box>
      </Box>
    </Page>
  )
})
