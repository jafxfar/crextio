import { CoursePage } from '@/components/course-editor/course-page'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ title?: string }>
}

export default async function CourseRoute({ params, searchParams }: Props) {
  const { id } = await params
  const { title } = await searchParams
  return <CoursePage courseId={id} initialTitle={title ?? 'Untitled Course'} />
}
