import React from "react";
import { atom } from 'recoil';
import { CommentInstance, Comment } from '../lexical-nodes';

export const allCommentInstancesState = atom<CommentInstance[]>({
  key: 'allCommentInstances',
  default: []
})

export const activeCommentState = atom<CommentInstance | undefined>({
  key: 'activeCommentState',
  default: undefined
})

export const lastUpdatedCommentInstanceState = atom<string>({
  key: 'lastUpdatedCommentInstance',
  default: ""
})
