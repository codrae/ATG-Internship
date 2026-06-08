import glob
import os
import logging

logger = logging.getLogger("app_logger")  # 기존 로거 사용
logging.basicConfig(level=logging.INFO)

def cleanup_old_files(building_id: str, energy_type: str, max_files: int = 3, file_extension="pth", directory="../services/train/trained_models") -> None:
    """
    특정 건물과 에너지원에 해당하는 파일 중 최대 개수를 초과하는 경우, 가장 오래된 파일부터 삭제하여 최신 파일만 남기는 함수.

    Args:
        directory (str): 파일을 검색할 디렉토리 경로.
        building_id (str): 건물 ID.
        energy_type (str): 에너지원 타입.
        max_files (int): 남겨둘 파일의 최대 개수 (기본값: 3).
        file_extension (str): 검색할 파일 확장자 (기본값: 'pth').

    Raises:
        None
    """
    # 파일 검색 패턴 생성
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target_directory = os.path.join(script_dir, directory)
    pattern = os.path.join(target_directory, f"{building_id}_{energy_type}_*.{file_extension}")
    list_of_files = glob.glob(pattern)

    if len(list_of_files) <= max_files:
        # 삭제할 파일이 없음
        logger.info("No files to delete. Current file count is within the limit.")
        return

    # 파일을 생성 시간 기준으로 정렬 (오래된 순)
    sorted_files = sorted(list_of_files, key=os.path.getctime)

    # 삭제할 파일 목록 (오래된 파일부터)
    files_to_delete = sorted_files[:-max_files]

    for file_path in files_to_delete:
        try:
            os.remove(file_path)
            logger.info(f"Deleted old model file: {file_path}")
        except Exception as e:
            logger.error(f"Failed to delete file {file_path}: {e}")

if __name__ == "__main__":
    # 테스트 실행을 위한 기본 값 설정
    test_building_id = "ANNIVERSARY_MEMORIAL_HALL"
    test_energy_type = "POWER"
    cleanup_old_files(building_id=test_building_id, energy_type=test_energy_type, max_files=3)
