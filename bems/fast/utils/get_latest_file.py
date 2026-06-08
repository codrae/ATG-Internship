import glob
import os


def get_latest_file(directory: str, building_id: str, energy_type: str, file_extension="pth") -> str:
    """
    주어진 디렉토리에서 특정 건물과 에너지원에 해당하는 가장 최근에 생성된 파일을 반환하는 함수.

    Args:
        directory (str): 파일을 검색할 디렉토리 경로.
        building_id (str): 건물 ID.
        energy_type (str): 에너지원 타입.
        file_extension (str): 검색할 파일 확장자 (기본값: 'pth').

    Returns:
        str: 가장 최근에 생성된 파일 경로.

    Raises:
        FileNotFoundError: 해당 조건에 맞는 파일이 없는 경우.
    """
    # 특정 건물과 에너지원에 해당하는 파일 패턴 생성
    pattern = os.path.join(directory, f"{building_id}_{energy_type}_*.{file_extension}")
    list_of_files = glob.glob(pattern)

    if not list_of_files:
        raise FileNotFoundError(f"No {file_extension} files found for building '{building_id}' and energy type '{energy_type}' in the '{directory}' folder.")

    # 가장 최근에 생성된 파일 찾기
    latest_file = max(list_of_files, key=os.path.getctime)
    return latest_file
