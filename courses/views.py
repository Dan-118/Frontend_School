from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from courses.models import Course
from courses.serializers import CourseSerializer

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            serializer = CourseSerializer(course)
            data = serializer.data
            
            # Add enrollment status to the response
            is_enrolled = course.enrollments.filter(student=request.user).exists()
            data['is_enrolled'] = is_enrolled
            
            return Response(data)
        except Course.DoesNotExist:
            return Response(
                {"message": "Course not found"}, 
                status=status.HTTP_404_NOT_FOUND
            ) 