import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Board, CreateBoardInput, UpdateBoardInput } from '../models/board'
import type { Card, CreateCardInput, UpdateCardInput } from '../models/card'
import type { ListStatus, ProjectList, UpdateListInput } from '../models/list'
import {
  createBoard as createBoardRequest,
  createCard as createCardRequest,
  createList,
  deleteBoard as deleteBoardRequest,
  deleteCard as deleteCardRequest,
  deleteList as deleteListRequest,
  getBoards,
  getCards,
  getLists,
  updateBoard as updateBoardRequest,
  updateCard as updateCardRequest,
  updateList as updateListRequest,
} from '../api/projectApi'

type CurrentUser = {
  id: string
  name: string
}

const defaultListTemplates: Array<{
  title: string
  status: ListStatus
  position: number
}> = [
  { title: 'To do', status: 'todo', position: 1 },
  { title: 'In progress', status: 'in-progress', position: 2 },
  { title: 'Done', status: 'done', position: 3 },
]

export const useProjectStore = defineStore('project', () => {
  const boards = ref<Board[]>([])
  const lists = ref<ProjectList[]>([])
  const cards = ref<Card[]>([])
  const currentUser = ref<CurrentUser>({
    id: 'user-1',
    name: 'Demo User',
  })
  const isLoading = ref(false)
  const errorMessage = ref('')

  const boardCount = computed(() => boards.value.length)

  async function loadBoards() {
    try {
      isLoading.value = true
      errorMessage.value = ''

      boards.value = await getBoards()
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    } finally {
      isLoading.value = false
    }
  }

  async function createBoard(input: CreateBoardInput) {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const board = await createBoardRequest(input)
      const defaultLists = await createDefaultLists(board.id)

      boards.value.push(board)
      lists.value = [
        ...lists.value.filter((list) => list.boardId !== board.id),
        ...defaultLists,
      ]

      return board
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  async function updateBoard(boardId: string, input: UpdateBoardInput) {
    try {
      errorMessage.value = ''

      const updatedBoard = await updateBoardRequest(boardId, input)

      boards.value = boards.value.map((board) =>
        board.id === boardId ? updatedBoard : board,
      )
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  async function deleteBoard(boardId: string) {
    try {
      errorMessage.value = ''

      await deleteBoardRequest(boardId)

      boards.value = boards.value.filter((board) => board.id !== boardId)
      lists.value = lists.value.filter((list) => list.boardId !== boardId)
      cards.value = cards.value.filter((card) => card.boardId !== boardId)
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  async function loadBoardDetails(boardId: string) {
    try {
      isLoading.value = true
      errorMessage.value = ''

      const boardLists = await getLists(boardId)
      const listCards = await Promise.all(
        boardLists.map((list) => getCards(boardId, list.id)),
      )

      lists.value = [
        ...lists.value.filter((list) => list.boardId !== boardId),
        ...boardLists,
      ]
      cards.value = [
        ...cards.value.filter((card) => card.boardId !== boardId),
        ...listCards.flat(),
      ]
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    } finally {
      isLoading.value = false
    }
  }

  function getBoard(boardId: string) {
    return boards.value.find((board) => board.id === boardId)
  }

  function getBoardLists(boardId: string) {
    return lists.value
      .filter((list) => list.boardId === boardId)
      .sort((firstList, secondList) => firstList.position - secondList.position)
  }

  function getBoardCards(boardId: string) {
    return cards.value
      .filter((card) => card.boardId === boardId)
      .sort((firstCard, secondCard) => firstCard.position - secondCard.position)
  }

  async function createCard(boardId: string, input: CreateCardInput) {
    try {
      errorMessage.value = ''

      const card = await createCardRequest(boardId, input)

      cards.value.push(card)
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  async function updateList(
    boardId: string,
    listId: string,
    input: UpdateListInput,
  ) {
    try {
      errorMessage.value = ''

      const updatedList = await updateListRequest(boardId, listId, input)

      lists.value = lists.value.map((list) =>
        list.id === listId ? updatedList : list,
      )
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  async function deleteList(boardId: string, listId: string) {
    try {
      errorMessage.value = ''

      await deleteListRequest(boardId, listId)

      lists.value = lists.value.filter((list) => list.id !== listId)
      cards.value = cards.value.filter((card) => card.listId !== listId)
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  async function updateCard(card: Card, input: UpdateCardInput) {
    try {
      errorMessage.value = ''

      const updatedCard = await updateCardRequest(
        card.boardId,
        card.listId,
        card.id,
        input,
      )

      cards.value = cards.value.map((currentCard) =>
        currentCard.id === card.id ? updatedCard : currentCard,
      )
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  async function deleteCard(card: Card) {
    try {
      errorMessage.value = ''

      await deleteCardRequest(card.boardId, card.listId, card.id)

      cards.value = cards.value.filter(
        (currentCard) => currentCard.id !== card.id,
      )
    } catch (error) {
      errorMessage.value = getErrorMessage(error)
    }
  }

  function createDefaultLists(boardId: string) {
    return Promise.all(
      defaultListTemplates.map((listTemplate) =>
        createList(boardId, {
          title: listTemplate.title,
          status: listTemplate.status,
          position: listTemplate.position,
        }),
      ),
    )
  }

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) {
      return error.message
    }

    return 'Something went wrong while talking to the API.'
  }

  return {
    boards,
    lists,
    cards,
    currentUser,
    isLoading,
    errorMessage,
    boardCount,
    loadBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    loadBoardDetails,
    getBoard,
    getBoardLists,
    getBoardCards,
    createCard,
    updateList,
    deleteList,
    updateCard,
    deleteCard,
  }
})
