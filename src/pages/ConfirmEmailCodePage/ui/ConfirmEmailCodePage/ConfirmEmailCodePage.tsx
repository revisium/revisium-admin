import { Center, Spinner } from '@chakra-ui/react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ConfirmEmailCodeViewModel } from 'src/pages/ConfirmEmailCodePage/model/ConfirmEmailCodeViewModel.ts'
import { useViewModel } from 'src/shared/lib'

export const ConfirmEmailCodePage: FC = observer(() => {
  const [searchParams] = useSearchParams({ code: '' })

  const model = useViewModel(ConfirmEmailCodeViewModel)

  useEffect(() => {
    model.confirmEmailCode(searchParams.get('code'))
  }, [model, searchParams])

  if (model.isLoading) {
    return (
      <Center w="100%" h="100%">
        <Spinner />
      </Center>
    )
  }

  return null
})
