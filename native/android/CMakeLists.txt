cmake_minimum_required(VERSION 3.22.1)
project("offlinelanguagetutor")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/../cpp/llama
)

add_library(
    llama_bridge
    SHARED
    ${CMAKE_CURRENT_SOURCE_DIR}/../cpp/llama/llama_jni.cpp
)

find_library(log-lib log)

target_link_libraries(
    llama_bridge
    ${log-lib}
)
