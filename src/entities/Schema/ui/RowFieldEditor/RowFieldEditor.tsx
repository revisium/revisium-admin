import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import React, { FC, PropsWithChildren } from 'react'
import { MdOutlineChevronRight } from 'react-icons/md'
import { PiDotOutlineFill } from 'react-icons/pi'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { Tooltip } from 'src/shared/ui'

interface RowFieldEditorProps {
  name?: string
  value?: React.ReactNode
  nameAndValueClassName?: string
  description?: string
  deprecated?: boolean
  colorName?: string
  onOverLabel?: () => void
  onOutLabel?: () => void
  store?: JsonValueStore
}

export const RowFieldEditor: FC<RowFieldEditorProps & PropsWithChildren> = observer(
  ({
    name,
    value,
    children,
    nameAndValueClassName,
    colorName,
    onOverLabel,
    onOutLabel,
    store,
    description,
    deprecated,
  }) => {
    const options =
      store instanceof JsonArrayValueStore || store instanceof JsonObjectValueStore
        ? {
            isCollapsible: store.isCollapsible,
            isCollapsed: store.isCollapsed,
            toggleCollapsed: store.toggleCollapsed,
          }
        : {}

    const dotOutlineClass = `dot-outline-${store?.nodeId}`
    const collapseButtonClass = `collapse-button-${store?.nodeId}`

    const hoverStyles =
      options.isCollapsible && !options.isCollapsed
        ? {
            [`& .${dotOutlineClass}`]: { visibility: 'hidden' },
            [`& .${collapseButtonClass}`]: { visibility: 'visible' },
          }
        : {}

    if (name === undefined && value === undefined) {
      return (
        <Flex flexDirection="column" width="100%">
          {children}
        </Flex>
      )
    }

    return (
      <Flex flexDirection="column" flex={1} width="100%" _hover={hoverStyles}>
        <Flex
          className={nameAndValueClassName}
          gap="4px"
          minHeight="28px"
          alignItems="flex-start"
          onMouseOver={onOverLabel}
          onMouseOut={onOutLabel}
        >
          <Box /* For hover */ position="absolute" ml="-60px" width="60px" height="28px" />
          <Flex
            color="gray.300"
            height="28px"
            alignItems="center"
            className={dotOutlineClass}
            visibility={options.isCollapsed ? 'hidden' : 'visible'}
          >
            <PiDotOutlineFill />
          </Flex>
          {options.isCollapsible && (
            <IconButton
              className={collapseButtonClass}
              visibility={!options.isCollapsed ? 'hidden' : 'visible'}
              _hover={{
                backgroundColor: 'transparent',
              }}
              ml="-8px"
              position="absolute"
              zIndex={1}
              size="xs"
              color={options.isCollapsed ? 'gray.600' : 'gray.300'}
              variant="ghost"
              onClick={options.toggleCollapsed}
              width="26px"
              height="26px"
            >
              <Box rotate={options.isCollapsed ? '0' : '90deg'}>
                <MdOutlineChevronRight />
              </Box>
            </IconButton>
          )}
          {name ? (
            <Flex flex={1}>
              {description ? (
                <Tooltip
                  openDelay={350}
                  closeDelay={50}
                  showArrow
                  content={description}
                  positioning={{
                    placement: 'right-end',
                  }}
                >
                  <Text color={colorName} fontWeight="300" textDecoration={deprecated ? 'line-through' : undefined}>
                    {name}
                  </Text>
                </Tooltip>
              ) : (
                <Text color={colorName} fontWeight="300" textDecoration={deprecated ? 'line-through' : undefined}>
                  {name}
                </Text>
              )}
              <Flex gap="4px" flex={1}>
                {value}
              </Flex>
            </Flex>
          ) : (
            <Flex>
              <Text>{value}</Text>
              <Box>:</Box>
            </Flex>
          )}
        </Flex>
        {children && !options.isCollapsed && (
          <Box
            ml="7px"
            pl="18px"
            borderLeftWidth={1}
            borderLeftStyle="solid"
            borderLeftColor="white"
            _hover={{
              borderLeftColor: 'blackAlpha.200',
            }}
          >
            {children}
          </Box>
        )}
      </Flex>
    )
  },
)
