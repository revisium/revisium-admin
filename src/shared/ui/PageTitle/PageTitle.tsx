import { Flex, Heading, HeadingProps } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { BackButton } from 'src/shared/ui'

interface PageTitleProps {
  value: string
  backLink?: string
  color?: HeadingProps['color']
}

export const PageTitle: React.FC<PageTitleProps> = ({ value, color, backLink }) => {
  const navigate = useNavigate()

  const handleBack = useCallback(() => {
    if (backLink) {
      navigate(backLink)
    }
  }, [backLink, navigate])

  return (
    <Flex alignItems="center" gap="1rem">
      {backLink && <BackButton onClick={handleBack} />}
      <Heading color={color || 'gray'} size="md">
        {value}
      </Heading>
    </Flex>
  )
}
